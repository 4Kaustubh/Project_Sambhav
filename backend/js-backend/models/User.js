const supabase = require('../config/supabaseClient');

class User {
  constructor(email, password, role) {
    this.email = email;
    this.password = password;
    this.role = role;
  }

  // Create a new user
  static async create(userData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            role: userData.role
          }
        }
      });

      if (error) {
        throw error;
      }

      // Insert additional user data into custom users table
      const { data: userRecord, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: userData.email,
            role: userData.role
          }
        ])
        .select();

      if (insertError) {
        throw insertError;
      }

      return { user: data.user, userRecord: userRecord[0] };
    } catch (error) {
      throw error;
    }
  }

  // Sign in user
  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        throw error;
      }

      // Get user role from custom users table
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        throw userError;
      }

      return {
        user: data.user,
        session: data.session,
        role: userRecord.role
      };
    } catch (error) {
      throw error;
    }
  }

  // Sign out user
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      // Get user role from custom users table
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userError) {
        throw userError;
      }

      return {
        user: user,
        role: userRecord.role
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get user by email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Update user role
  static async updateRole(userId, newRole) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all users (admin only)
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Validate user role
  static validateRole(role) {
    const validRoles = ['data-collector', 'trainer', 'admin', 'placement-officer'];
    return validRoles.includes(role);
  }
}

module.exports = User;

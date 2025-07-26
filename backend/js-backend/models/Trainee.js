const supabase = require('../supabaseClient');

class Trainee {
  constructor(data) {
    this.name = data.name;
    this.education = data.education;
    this.age = data.age;
    this.gender = data.gender;
    this.experience = data.experience;
    this.location = data.location;
    this.disability = data.disability;
    this.breadwinner = data.breadwinner;
    this.english_knowledge = data.english_knowledge;
  }

  // Create a new trainee
  static async create(traineeData) {
    try {
      const { data, error } = await supabase
        .from('trainees')
        .insert([traineeData])
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all trainees
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('trainees')
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

  // Get trainee by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('trainees')
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

  // Update trainee
  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('trainees')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete trainee
  static async delete(id) {
    try {
      const { error } = await supabase
        .from('trainees')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Get trainees by education level
  static async getByEducation(education) {
    try {
      const { data, error } = await supabase
        .from('trainees')
        .select('*')
        .eq('education', education)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get trainees by location
  static async getByLocation(location) {
    try {
      const { data, error } = await supabase
        .from('trainees')
        .select('*')
        .eq('location', location)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get trainees by gender
  static async getByGender(gender) {
    try {
      const { data, error } = await supabase
        .from('trainees')
        .select('*')
        .eq('gender', gender)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get trainees with disabilities
  static async getWithDisabilities() {
    try {
      const { data, error } = await supabase
        .from('trainees')
        .select('*')
        .eq('disability', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get trainees who are breadwinners
  static async getBreadwinners() {
    try {
      const { data, error } = await supabase
        .from('trainees')
        .select('*')
        .eq('breadwinner', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get trainees with English knowledge
  static async getWithEnglishKnowledge() {
    try {
      const { data, error } = await supabase
        .from('trainees')
        .select('*')
        .eq('english_knowledge', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Search trainees by name
  static async searchByName(name) {
    try {
      const { data, error } = await supabase
        .from('trainees')
        .select('*')
        .ilike('name', `%${name}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get trainees count
  static async getCount() {
    try {
      const { count, error } = await supabase
        .from('trainees')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      return count;
    } catch (error) {
      throw error;
    }
  }

  // Validate trainee data
  static validateTraineeData(data) {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
      errors.push('Name is required');
    }

    if (!data.education || !['5th', '10th', '12th', 'diploma'].includes(data.education)) {
      errors.push('Valid education level is required');
    }

    if (!data.age || data.age < 18 || data.age > 65) {
      errors.push('Age must be between 18 and 65');
    }

    if (!data.gender || !['male', 'female', 'other'].includes(data.gender)) {
      errors.push('Valid gender is required');
    }

    if (!data.location || data.location.trim() === '') {
      errors.push('Location is required');
    }

    if (typeof data.disability !== 'boolean') {
      errors.push('Disability status must be specified');
    }

    if (typeof data.breadwinner !== 'boolean') {
      errors.push('Breadwinner status must be specified');
    }

    if (typeof data.english_knowledge !== 'boolean') {
      errors.push('English knowledge status must be specified');
    }

    return errors;
  }
}

module.exports = Trainee;

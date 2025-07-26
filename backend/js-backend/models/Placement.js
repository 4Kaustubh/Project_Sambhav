const supabase = require('../supabaseClient');

class Placement {
  constructor(data) {
    this.trainee_id = data.trainee_id;
    this.company_id = data.company_id;
    this.status = data.status;
  }

  // Create a new placement
  static async create(placementData) {
    try {
      const { data, error } = await supabase
        .from('placements')
        .insert([placementData])
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all placements
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('placements')
        .select(`
          *,
          trainees(name, education, age, gender, location),
          companies(name, domain, pin_code)
        `)
        .order('placed_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get placement by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('placements')
        .select(`
          *,
          trainees(name, education, age, gender, location),
          companies(name, domain, pin_code)
        `)
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

  // Get placements by trainee ID
  static async getByTraineeId(traineeId) {
    try {
      const { data, error } = await supabase
        .from('placements')
        .select(`
          *,
          trainees(name, education, age, gender, location),
          companies(name, domain, pin_code)
        `)
        .eq('trainee_id', traineeId)
        .order('placed_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get placements by company ID
  static async getByCompanyId(companyId) {
    try {
      const { data, error } = await supabase
        .from('placements')
        .select(`
          *,
          trainees(name, education, age, gender, location),
          companies(name, domain, pin_code)
        `)
        .eq('company_id', companyId)
        .order('placed_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Update placement
  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('placements')
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

  // Delete placement
  static async delete(id) {
    try {
      const { error } = await supabase
        .from('placements')
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

  // Get placements by status
  static async getByStatus(status) {
    try {
      const { data, error } = await supabase
        .from('placements')
        .select(`
          *,
          trainees(name, education, age, gender, location),
          companies(name, domain, pin_code)
        `)
        .eq('status', status)
        .order('placed_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get confirmed placements
  static async getConfirmed() {
    try {
      return await this.getByStatus('confirmed');
    } catch (error) {
      throw error;
    }
  }

  // Get pending placements
  static async getPending() {
    try {
      return await this.getByStatus('pending');
    } catch (error) {
      throw error;
    }
  }

  // Get placement count
  static async getCount() {
    try {
      const { count, error } = await supabase
        .from('placements')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      return count;
    } catch (error) {
      throw error;
    }
  }

  // Get placement statistics
  static async getStatistics() {
    try {
      const { data, error } = await supabase
        .from('placements')
        .select('status');

      if (error) {
        throw error;
      }

      const stats = {
        totalPlacements: data.length,
        confirmed: 0,
        pending: 0
      };

      data.forEach(placement => {
        if (placement.status === 'confirmed') {
          stats.confirmed++;
        } else if (placement.status === 'pending') {
          stats.pending++;
        }
      });

      stats.placementRate = stats.totalPlacements > 0 ?
        (stats.confirmed / stats.totalPlacements) * 100 : 0;

      return stats;
    } catch (error) {
      throw error;
    }
  }

  // Get recent placements
  static async getRecent(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('placements')
        .select(`
          *,
          trainees(name, education, age, gender, location),
          companies(name, domain, pin_code)
        `)
        .order('placed_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Check if trainee is already placed
  static async isTraineePlaced(traineeId) {
    try {
      const { data, error } = await supabase
        .from('placements')
        .select('id')
        .eq('trainee_id', traineeId)
        .eq('status', 'confirmed')
        .limit(1);

      if (error) {
        throw error;
      }

      return data.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get placements grouped by company
  static async getGroupedByCompany() {
    try {
      const { data, error } = await supabase
        .from('placements')
        .select(`
          *,
          trainees(name, education, age, gender, location),
          companies(name, domain, pin_code)
        `)
        .order('placed_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Group placements by company
      const grouped = data.reduce((acc, placement) => {
        const companyName = placement.companies.name;
        if (!acc[companyName]) {
          acc[companyName] = [];
        }
        acc[companyName].push(placement);
        return acc;
      }, {});

      return grouped;
    } catch (error) {
      throw error;
    }
  }

  // Get placements by date range
  static async getByDateRange(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('placements')
        .select(`
          *,
          trainees(name, education, age, gender, location),
          companies(name, domain, pin_code)
        `)
        .gte('placed_at', startDate)
        .lte('placed_at', endDate)
        .order('placed_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Update placement status
  static async updateStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from('placements')
        .update({ status })
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

  // Confirm placement
  static async confirm(id) {
    try {
      return await this.updateStatus(id, 'confirmed');
    } catch (error) {
      throw error;
    }
  }

  // Validate placement data
  static validatePlacementData(data) {
    const errors = [];

    if (!data.trainee_id || data.trainee_id.trim() === '') {
      errors.push('Trainee ID is required');
    }

    if (!data.company_id || data.company_id.trim() === '') {
      errors.push('Company ID is required');
    }

    if (!data.status || !['pending', 'confirmed'].includes(data.status)) {
      errors.push('Valid status is required');
    }

    return errors;
  }
}

module.exports = Placement;

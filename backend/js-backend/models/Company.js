const supabase = require('../supabaseClient');

class Company {
    constructor(data) {
        this.name = data.name;
        this.domain = data.domain;
        this.openings = data.openings;
        this.pin_code = data.pin_code;
        this.description = data.description;
    }

    // Create a new company
    static async create(companyData) {
        try {
            const { data, error } = await supabase
                .from('companies')
                .insert([companyData])
                .select();

            if (error) {
                throw error;
            }

            return data[0];
        } catch (error) {
            throw error;
        }
    }

    // Get all companies
    static async getAll() {
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .order('name', { ascending: true });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Get company by ID
    static async findById(id) {
        try {
            const { data, error } = await supabase
                .from('companies')
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

    // Update company
    static async update(id, updateData) {
        try {
            const { data, error } = await supabase
                .from('companies')
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

    // Delete company
    static async delete(id) {
        try {
            const { error } = await supabase
                .from('companies')
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

    // Get companies by domain
    static async getByDomain(domain) {
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .eq('domain', domain)
                .order('name', { ascending: true });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Get companies by PIN code
    static async getByPinCode(pinCode) {
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .eq('pin_code', pinCode)
                .order('name', { ascending: true });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Get companies with openings
    static async getWithOpenings() {
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .gt('openings', 0)
                .order('name', { ascending: true });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Search companies by name
    static async searchByName(name) {
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .ilike('name', `%${name}%`)
                .order('name', { ascending: true });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Get companies count
    static async getCount() {
        try {
            const { count, error } = await supabase
                .from('companies')
                .select('*', { count: 'exact', head: true });

            if (error) {
                throw error;
            }

            return count;
        } catch (error) {
            throw error;
        }
    }

    // Get total openings across all companies
    static async getTotalOpenings() {
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('openings');

            if (error) {
                throw error;
            }

            return data.reduce((total, company) => total + company.openings, 0);
        } catch (error) {
            throw error;
        }
    }

    // Get companies grouped by domain
    static async getGroupedByDomain() {
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .order('domain', { ascending: true });

            if (error) {
                throw error;
            }

            // Group companies by domain
            const grouped = data.reduce((acc, company) => {
                if (!acc[company.domain]) {
                    acc[company.domain] = [];
                }
                acc[company.domain].push(company);
                return acc;
            }, {});

            return grouped;
        } catch (error) {
            throw error;
        }
    }

    // Update company openings
    static async updateOpenings(id, openings) {
        try {
            const { data, error } = await supabase
                .from('companies')
                .update({ openings })
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

    // Validate company data
    static validateCompanyData(data) {
        const errors = [];

        if (!data.name || data.name.trim() === '') {
            errors.push('Company name is required');
        }

        if (!data.domain || data.domain.trim() === '') {
            errors.push('Domain is required');
        }

        if (!data.openings || data.openings < 0) {
            errors.push('Number of openings must be a positive number');
        }

        if (!data.pin_code || data.pin_code.trim() === '') {
            errors.push('PIN code is required');
        }

        // Validate PIN code format (6 digits)
        if (data.pin_code && !/^\d{6}$/.test(data.pin_code)) {
            errors.push('PIN code must be exactly 6 digits');
        }

        return errors;
    }
}

module.exports = Company;

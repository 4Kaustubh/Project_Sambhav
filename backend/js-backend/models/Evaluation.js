const supabase = require('../supabaseClient');

class Evaluation {
    constructor(data) {
        this.trainee_id = data.trainee_id;
        this.evaluator_id = data.evaluator_id;
        this.comments = data.comments;
        this.score = data.score;
        this.recommendation = data.recommendation;
    }

    // Create a new evaluation
    static async create(evaluationData) {
        try {
            const { data, error } = await supabase
                .from('evaluations')
                .insert([evaluationData])
                .select();

            if (error) {
                throw error;
            }

            return data[0];
        } catch (error) {
            throw error;
        }
    }

    // Get all evaluations
    static async getAll() {
        try {
            const { data, error } = await supabase
                .from('evaluations')
                .select(`
          *,
          trainees(name, education, age, gender),
          users(email, role)
        `)
                .order('evaluated_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Get evaluation by ID
    static async findById(id) {
        try {
            const { data, error } = await supabase
                .from('evaluations')
                .select(`
          *,
          trainees(name, education, age, gender),
          users(email, role)
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

    // Get evaluations by trainee ID
    static async getByTraineeId(traineeId) {
        try {
            const { data, error } = await supabase
                .from('evaluations')
                .select(`
          *,
          trainees(name, education, age, gender),
          users(email, role)
        `)
                .eq('trainee_id', traineeId)
                .order('evaluated_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Get evaluations by evaluator ID
    static async getByEvaluatorId(evaluatorId) {
        try {
            const { data, error } = await supabase
                .from('evaluations')
                .select(`
          *,
          trainees(name, education, age, gender),
          users(email, role)
        `)
                .eq('evaluator_id', evaluatorId)
                .order('evaluated_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Update evaluation
    static async update(id, updateData) {
        try {
            const { data, error } = await supabase
                .from('evaluations')
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

    // Delete evaluation
    static async delete(id) {
        try {
            const { error } = await supabase
                .from('evaluations')
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

    // Get evaluations by recommendation
    static async getByRecommendation(recommendation) {
        try {
            const { data, error } = await supabase
                .from('evaluations')
                .select(`
          *,
          trainees(name, education, age, gender),
          users(email, role)
        `)
                .eq('recommendation', recommendation)
                .order('evaluated_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Get evaluations by score range
    static async getByScoreRange(minScore, maxScore) {
        try {
            const { data, error } = await supabase
                .from('evaluations')
                .select(`
          *,
          trainees(name, education, age, gender),
          users(email, role)
        `)
                .gte('score', minScore)
                .lte('score', maxScore)
                .order('evaluated_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Get average score for a trainee
    static async getAverageScoreByTrainee(traineeId) {
        try {
            const { data, error } = await supabase
                .from('evaluations')
                .select('score')
                .eq('trainee_id', traineeId);

            if (error) {
                throw error;
            }

            if (data.length === 0) {
                return 0;
            }

            const totalScore = data.reduce((sum, evaluation) => sum + evaluation.score, 0);
            return totalScore / data.length;
        } catch (error) {
            throw error;
        }
    }

    // Get evaluation count
    static async getCount() {
        try {
            const { count, error } = await supabase
                .from('evaluations')
                .select('*', { count: 'exact', head: true });

            if (error) {
                throw error;
            }

            return count;
        } catch (error) {
            throw error;
        }
    }

    // Get evaluation statistics
    static async getStatistics() {
        try {
            const { data, error } = await supabase
                .from('evaluations')
                .select('score, recommendation');

            if (error) {
                throw error;
            }

            const stats = {
                totalEvaluations: data.length,
                averageScore: 0,
                recommendations: {
                    ready: 0,
                    additional: 0,
                    reassess: 0
                }
            };

            if (data.length > 0) {
                stats.averageScore = data.reduce((sum, evaluation) => sum + evaluation.score, 0) / data.length;

                data.forEach(evaluation => {
                    if (evaluation.recommendation in stats.recommendations) {
                        stats.recommendations[evaluation.recommendation]++;
                    }
                });
            }

            return stats;
        } catch (error) {
            throw error;
        }
    }

    // Get recent evaluations
    static async getRecent(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('evaluations')
                .select(`
          *,
          trainees(name, education, age, gender),
          users(email, role)
        `)
                .order('evaluated_at', { ascending: false })
                .limit(limit);

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Check if trainee has been evaluated
    static async hasBeenEvaluated(traineeId) {
        try {
            const { data, error } = await supabase
                .from('evaluations')
                .select('id')
                .eq('trainee_id', traineeId)
                .limit(1);

            if (error) {
                throw error;
            }

            return data.length > 0;
        } catch (error) {
            throw error;
        }
    }

    // Validate evaluation data
    static validateEvaluationData(data) {
        const errors = [];

        if (!data.trainee_id) {
            errors.push('Trainee ID is required');
        }

        if (!data.evaluator_id || data.evaluator_id.trim() === '') {
            errors.push('Evaluator ID is required');
        }

        if (data.score === undefined || data.score < 0 || data.score > 100) {
            errors.push('Score must be between 0 and 100');
        }

        if (!data.recommendation || !['ready', 'additional', 'reassess'].includes(data.recommendation)) {
            errors.push('Valid recommendation is required');
        }

        return errors;
    }
}

module.exports = Evaluation;

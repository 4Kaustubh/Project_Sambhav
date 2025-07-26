const supabase = require('../supabaseClient');

class OTP {
  constructor(traineeId, otpCode) {
    this.trainee_id = traineeId;
    this.otp_code = otpCode;
  }

  // Generate and save OTP
  static async generate(traineeId) {
    try {
      // Generate 4-digit OTP
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

      // Delete any existing OTP for this trainee
      await supabase
        .from('otps')
        .delete()
        .eq('trainee_id', traineeId);

      // Insert new OTP
      const { data, error } = await supabase
        .from('otps')
        .insert([
          {
            trainee_id: traineeId,
            otp_code: otpCode
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    } catch (error) {
      throw error;
    }
  }

  // Verify OTP with trainee ID and OTP
  static async verify(otpCode, traineeId) {
    try {
      const { data, error } = await supabase
        .from('otps')
        .select('*')
        .eq('otp', otpCode)
        .eq('status', 'pending')
        .single();

      if (error) {
        return { success: false, message: 'Invalid OTP' };
      }

      // Check if OTP is not expired (valid for 10 minutes)
      const otpTime = new Date(data.created_at);
      const currentTime = new Date();
      const diffMinutes = (currentTime - otpTime) / (1000 * 60);

      if (diffMinutes > 10) {
        // OTP expired, update status
        await supabase
          .from('otps')
          .update({ status: 'expired' })
          .eq('id', data.id);
        return { success: false, message: 'OTP expired' };
      }

      // OTP is valid, update status to verified
      await supabase
        .from('otps')
        .update({ status: 'verified' })
        .eq('id', data.id);

      return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
      return { success: false, message: 'Verification failed' };
    }
  }

  // Create OTP record for IVR system
  static async create(otpData) {
    try {
      const { data, error } = await supabase
        .from('otps')
        .insert([otpData])
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    } catch (error) {
      throw error;
    }
  }

  // Mark expired OTPs
  static async markExpiredOtps() {
    try {
      const { error } = await supabase
        .from('otps')
        .update({ status: 'expired' })
        .eq('status', 'pending')
        .lt('expires_at', new Date().toISOString());

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error marking expired OTPs:', error);
    }
  }

  // Get OTP statistics
  static async getStats() {
    try {
      const { data, error } = await supabase
        .from('otps')
        .select('status')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        throw error;
      }

      const stats = {
        total: data.length,
        pending: data.filter(otp => otp.status === 'pending').length,
        verified: data.filter(otp => otp.status === 'verified').length,
        expired: data.filter(otp => otp.status === 'expired').length
      };

      return stats;
    } catch (error) {
      throw error;
    }
  }

  // Get all OTPs for admin
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('otps')
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

  // Get OTPs by trainee ID for attendance calculation
  static async getByTraineeId(traineeId) {
    try {
      const { data, error } = await supabase
        .from('otps')
        .select('*')
        .eq('trainee_id', traineeId)
        .eq('status', 'verified')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OTP;

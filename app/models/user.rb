class User < ActiveRecord::Base
    include BCrypt
    validates :username, :password_digest, presence: true
    validates :username, uniqueness: true
    before_create :ensure_session_token

    def password

    end

    def ensure_session_token
      self.session_token ||= SecureRandom.urlsafe_base64(16)
    end

    def password=(new_password)
      p new_password
      self.password_digest = BCrypt::Password.create(new_password)
    end

    def is_password?(password)
      p password
      bCrypt = BCrypt::Password.new(self.password_digest)
      p bCrypt.is_password?(password)
      return bCrypt.is_password?(password)
    end

    def reset_token()
      self.session_token = SecureRandom.urlsafe_base64(16)
      self.save!
    end

    def permissions=(permits)
      permits.each do |permit|
        p (permit+'=').to_sym
        self.send((permit+'=').to_sym, true)
      end
    end
end

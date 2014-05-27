class User < ActiveRecord::Base
    include BCrypt
    validates :username, :password_digest, presence: true
    before_create :ensure_session_token

    def password

    end

    def ensure_session_token
      self.session_token = SecureRandom.urlsafe_base64(16)
    end

    def password=(new_password)
      self.password_digest = BCrypt::Password.create("my password")
    end
end

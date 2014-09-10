# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  username        :string(255)
#  password_digest :string(255)
#  session_token   :string(255)
#  email           :string(255)
#  created_at      :datetime
#  updated_at      :datetime
#  permitNsfw      :boolean
#  permitEmail     :boolean
#

class User < ActiveRecord::Base
    include BCrypt
    validates :username, :password_digest, presence: true
    validates :username, uniqueness: true
    before_create :ensure_session_token, :ensure_viewed_count
    has_many :open_walls

    def password

    end

    def ensure_session_token
      self.session_token ||= SecureRandom.urlsafe_base64(16)
    end

    def ensure_viewed_count
      ensure_viewed_count ||= 0
    end

    def password=(new_password)
      self.password_digest = BCrypt::Password.create(new_password)
    end

    def is_password?(password)
      bCrypt = BCrypt::Password.new(self.password_digest)
      return bCrypt.is_password?(password)
    end

    def reset_token()
      self.session_token = SecureRandom.urlsafe_base64(16)
      self.save!
    end

    def permissions=(permits)
      permits.each do |permit|
        self.send((permit+'=').to_sym, true)
      end
    end
end

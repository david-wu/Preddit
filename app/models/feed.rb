# == Schema Information
#
# Table name: feeds
#
#  id         :integer          not null, primary key
#  userId     :integer
#  name       :string(255)
#  vanity     :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class Feed < ActiveRecord::Base
end

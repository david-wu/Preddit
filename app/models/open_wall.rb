# == Schema Information
#
# Table name: open_wall
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  type       :string(255)
#  name       :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class OpenWall < ActiveRecord::Base
	belongs_to :users
  validates_uniqueness_of :name, scope: [:user_id, :is_feed]
end

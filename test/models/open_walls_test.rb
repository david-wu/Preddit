# == Schema Information
#
# Table name: open_walls
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  type       :string(255)
#  name       :string(255)
#  created_at :datetime
#  updated_at :datetime
#

require 'test_helper'

class OpenWallsTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

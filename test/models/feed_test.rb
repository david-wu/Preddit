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

require 'test_helper'

class FeedTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

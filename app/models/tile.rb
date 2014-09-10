# == Schema Information
#
# Table name: tiles
#
#  id          :integer          not null, primary key
#  user_id     :integer
#  sender_id   :integer
#  sender_name :string(255)
#  title       :string(255)
#  url         :string(255)
#  author      :string(255)
#  domain      :string(255)
#  imgSrc      :string(255)
#  permalink   :string(255)
#  subreddit   :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  over_18     :boolean
#  viewed      :boolean
#

class Tile < ActiveRecord::Base
  validates_uniqueness_of :user_id, scope: [:sender_id, :url, :title, :permalink]


end

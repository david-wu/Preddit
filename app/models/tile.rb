class Tile < ActiveRecord::Base
  validates_uniqueness_of :user_id, scope: [:sender_id, :url, :title, :permalink]


end

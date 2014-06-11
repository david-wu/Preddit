class Nsfw < ActiveRecord::Migration
  def change
     add_column :tiles, :over_18, :boolean
  end
end

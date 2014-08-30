class AddColumnTiles < ActiveRecord::Migration
  def change
  	add_column :tiles, :viewed, :boolean
  end
end

class CreateOpenWalls < ActiveRecord::Migration
  def change
    create_table :open_walls do |t|
      t.integer :user_id
      t.string :type
      t.string :name

      t.timestamps
    end
  end
end

class CreateOpenWalls < ActiveRecord::Migration
  def change
    create_table :open_walls do |t|
      t.integer :user_id, null: false
      t.string :name, null: false
      t.boolean :is_feed

      t.timestamps
    end
    add_index :open_walls, [:name, :user_id], unique: true
  end
end

class AddColumnToUsers < ActiveRecord::Migration
  def change
  	add_column :users, :unviewed_count, :integer, default: 0
  end
end

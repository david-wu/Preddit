class UsersPermissions < ActiveRecord::Migration
  def change
    add_column :users, :permitNsfw, :boolean
    add_column :users, :permitEmail, :boolean
  end
end

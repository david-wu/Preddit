class CreateFeeds < ActiveRecord::Migration
  def change
    create_table :feeds do |t|
      t.integer :userId
      t.string :name
      t.string :vanity

      t.timestamps
    end
  end
end

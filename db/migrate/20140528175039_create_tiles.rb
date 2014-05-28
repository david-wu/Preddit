class CreateTiles < ActiveRecord::Migration
  def change
    create_table :tiles do |t|
      t.integer :user_id
      t.integer :sender_id
      t.string :title
      t.string :url
      t.string :author
      t.string :domain
      t.string :imgSrc
      t.string :permalink
      t.string :subreddit


      t.timestamps
    end
  end
end

class AddCommentCountColumn < ActiveRecord::Migration
  def change
  	add_column :tiles, :num_comments, :integer
  end
end

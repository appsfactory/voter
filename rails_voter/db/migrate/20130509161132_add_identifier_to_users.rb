class AddIdentifierToUsers < ActiveRecord::Migration
  def change
    add_column :users, :guid, :integer
  end
end

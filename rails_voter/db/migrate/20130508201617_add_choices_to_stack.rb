class AddChoicesToStack < ActiveRecord::Migration
  def change
    add_column :stacks, :choices, :string
  end
end

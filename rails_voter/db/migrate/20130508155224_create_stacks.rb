class CreateStacks < ActiveRecord::Migration
  def change
    create_table :stacks do |t|
      t.integer :id
      t.string :name
      t.string :question
      t.string :answer

      t.timestamps
    end
  end
end

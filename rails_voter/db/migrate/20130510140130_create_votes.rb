class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.string :name
      t.string :question
      t.string :answer
      t.integer :counter
      t.integer :user

      t.timestamps
    end
  end
end

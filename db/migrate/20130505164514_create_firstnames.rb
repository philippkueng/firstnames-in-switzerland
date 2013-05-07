class CreateFirstnames < ActiveRecord::Migration
  def change
    create_table :firstnames do |t|
      t.string :name
      t.integer :rank
      t.integer :count
      t.string :sex
      t.string :year

      t.timestamps
    end
  end
end

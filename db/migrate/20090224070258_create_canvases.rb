class CreateCanvases < ActiveRecord::Migration
  def self.up
    create_table :canvases do |t|
      t.text :data

      t.timestamps
    end
  end

  def self.down
    drop_table :canvases
  end
end

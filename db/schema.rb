# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140909235944) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "feeds", force: true do |t|
    t.integer  "userId"
    t.string   "name"
    t.string   "vanity"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "open_walls", force: true do |t|
    t.integer  "user_id",    null: false
    t.string   "name",       null: false
    t.boolean  "is_feed"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "open_walls", ["name", "user_id"], name: "index_open_walls_on_name_and_user_id", unique: true, using: :btree

  create_table "tiles", force: true do |t|
    t.integer  "user_id"
    t.integer  "sender_id"
    t.string   "sender_name"
    t.string   "title"
    t.string   "url"
    t.string   "author"
    t.string   "domain"
    t.string   "imgSrc"
    t.string   "permalink"
    t.string   "subreddit"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "over_18"
    t.boolean  "viewed"
    t.integer  "num_comments"
  end

  create_table "users", force: true do |t|
    t.string   "username"
    t.string   "password_digest"
    t.string   "session_token"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "permitNsfw"
    t.boolean  "permitEmail"
    t.integer  "unviewed_count",  default: 0
  end

end

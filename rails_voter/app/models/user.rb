class User < ActiveRecord::Base
  attr_accessible :email, :name, :password, :password_confirmation, :guid
  has_secure_password

  validates :name, presence: true
  validates :email, presence: true
  validates :password, presence: true
  validates :password_confirmation, presence: true
end

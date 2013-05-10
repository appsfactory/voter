class Vote < ActiveRecord::Base
  attr_accessible :answer, :counter, :name, :question, :user
end

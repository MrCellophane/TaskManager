# frozen_string_literal: true

class Task < ApplicationRecord
    belongs_to :author, class_name: 'User'
    belongs_to :assignee, class_name: 'User', optional: true
    
    validates :name, presence: true
    validates :description, presence: true
    validates :author, presence: true
    validates :description, length: { maximum: 500 }

    class Vehicle < ActiveRecord::Base
        state_machine :state, initial => :new_task do
          event :archived do
            transition :new_task => archived
            transition :released => archived
          end
          
          event :released do
            transition :ready_for_release => released
          end

          event :ready_for_release do
            transition :in_code_review => ready_for_release
          end

          event :in_code_review do
            transition :in_qa => in_code_review
          end

          event :in_qa do 
            transition :in_development => in_qa
          end
          
          event :in_development do
            transition :in_qa => in_development
            transition :in_code_review => in_development
            transition :new_task => in_development
          end
        end
      
end

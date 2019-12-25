# frozen_string_literal: true

FactoryBot.define do
  sequence :email do |n|
    "email#{n}@factory.com"
  end
  sequence :first_name, aliases: %i[last_name password avatar name description string] do |n|
    "string#{n}"
  end
end

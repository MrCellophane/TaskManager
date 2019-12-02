# frozen_string_literal: true

FactoryBot.define do
  factory :task do
    name
    description
    author { create :user }
    state
    expired_at
  end
end

class TaskSerializer < ActiveModel::Serializer
  attributes :id, :description, :state, :expired_at
  belongs_to :author
  belongs_to :assignee
end

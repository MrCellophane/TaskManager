# frozen_string_literal: true

Rails.application.routes.draw do
  root to: 'web/board#show'

  scope module: :web do
    resource :session, only: %i[new create destroy]
    resource :board, only: :show
    resources :developers, only: %i[new create]
  end
end

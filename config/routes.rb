Rails.application.routes.draw do
  root 'tiles#index'
  namespace :api do
    resources :users
    resource :session
  end
end

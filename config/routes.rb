Rails.application.routes.draw do
  root 'tiles#index'
  namespace :api do
    resources :users
    post 'users/current' => 'users#current'

    resource :session
  end

end

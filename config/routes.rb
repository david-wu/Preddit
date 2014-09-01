Rails.application.routes.draw do
  root 'tiles#index'
  namespace :api do
    resources :users
    post 'users/current' => 'users#current'

    resource :session
    resources :tiles
    resources :open_walls
  end

end

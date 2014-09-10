Rails.application.routes.draw do
  root 'tiles#index'
  namespace :api do
    get 'users/current' => 'users#current'
    resources :users do
    	# resources :tiles, only: [:index]
    end

    resource :session
    # some of tile resources should be nested under users
    # resources :tiles, except: [:index]

    resources :tiles
    resources :open_walls
  end

end

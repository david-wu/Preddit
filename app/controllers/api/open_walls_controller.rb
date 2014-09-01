class Api::OpenWallsController < ApplicationController

	def index
    @requesting_user = User.find_by(session_token: params[:session_token])
    @open_walls = OpenWalls.where(user_id: @requesting_user.id).order(created_at: :desc)
    render json: @open_walls
	end

  def open_walls_params
    params.permit('session_token')
  end
end

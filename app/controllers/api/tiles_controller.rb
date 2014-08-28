class Api::TilesController < ApplicationController
  # this should be a join, not two seperate queries
  def create    
    @tile = Tile.new(tile_params)
    if(params['target_name'])
      @user = User.find_by(username: params['target_name'])
      @tile.user_id = @user.id
    end

    if params['sender_id']
      @tile.sender_id = Integer(params['sender_id'])
      @tile.sender_name = User.find(@tile.sender_id).username
    end

    if @tile.save
      render json: { tile: @tile }
    else
      render json: { errors: @tile.errors.full_messages }, status: 422
    end
  end

  def index
    @user = User.find_by(user_id, 1);
    @tiles = Tiles.where(user_id: tile_params['user_id'])
    return json @tiles
  end

  def tile_params
    params.permit('user_id', 'title', 'url', 'author', 'domain', 'imgSrc', 'permalink', 'subreddit', 'over_18')
  end

  def show
    @user = User.find_by(username: params[:id])
    @tiles = Tile.where(user_id: @user.id)
    render json: @tiles
  end

  def destroy
    @tile = Tile.find(params[:id])
    @tile.destroy
    render json: { tile: @tile}
  end
end

module ApplicationHelper
  def current_user
    p cookies[:sessionToken]
    cookies[:sessionToken]
    @user = User.find_by(session_token: cookies[:sessionToken])
    if @user
      return @user.username
    else
      return "Account"
    end
  end
end

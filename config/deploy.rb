set :application, "drawdrawdraw"
set :scm, "git"
set :repository,  "git://github.com/visnup/drawdrawdraw.git"
set :deploy_via, :remote_cache

set :user, "app"
set :rails_env, "production"
set :use_sudo, false

role :app, "drawdrawdraw.jankyteeth.com"
role :web, "drawdrawdraw.jankyteeth.com"
role :db,  "drawdrawdraw.jankyteeth.com", :primary => true

namespace :deploy do
  desc "Restart Application"
  task :restart, :roles => :app do
    run "touch #{current_path}/tmp/restart.txt"
  end
end

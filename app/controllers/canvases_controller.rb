class CanvasesController < ApplicationController
  # GET /canvases
  # GET /canvases.xml
  def index
    @canvases =
      if params[:since]
        Canvas.find(:all, :conditions => ['created_at > ?', params[:since]])
      else
        Canvas.find(:all)
      end

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @canvases }
      format.json { render :json => @canvases }
    end
  end

  # GET /canvases/1
  # GET /canvases/1.xml
  def show
    @canvas = Canvas.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @canvas }
    end
  end

  # GET /canvases/new
  # GET /canvases/new.xml
  def new
    @canvas = Canvas.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @canvas }
    end
  end

  # GET /canvases/1/edit
  def edit
    @canvas = Canvas.find(params[:id])
  end

  # POST /canvases
  # POST /canvases.xml
  def create
    @canvas = Canvas.new(params[:canvas])

    respond_to do |format|
      if @canvas.save
        flash[:notice] = 'Canvas was successfully created.'
        format.html { redirect_to(@canvas) }
        format.xml  { render :xml => @canvas, :status => :created, :location => @canvas }
        format.json { render :json => @canvas, :status => :created, :location => @canvas }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @canvas.errors, :status => :unprocessable_entity }
        format.json { render :json => @canvas.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /canvases/1
  # PUT /canvases/1.xml
  def update
    @canvas = Canvas.find(params[:id])

    respond_to do |format|
      if @canvas.update_attributes(params[:canvas])
        flash[:notice] = 'Canvas was successfully updated.'
        format.html { redirect_to(@canvas) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @canvas.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /canvases/1
  # DELETE /canvases/1.xml
  def destroy
    @canvas = Canvas.find(params[:id])
    @canvas.destroy

    respond_to do |format|
      format.html { redirect_to(canvases_url) }
      format.xml  { head :ok }
    end
  end

  def clear
    Canvas.delete_all

    respond_to do |format|
      format.html { redirect_to(root_url) }
      format.xml  { head :ok }
    end
  end
end

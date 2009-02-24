require 'test_helper'

class CanvasesControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:canvases)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create canvas" do
    assert_difference('Canvas.count') do
      post :create, :canvas => { }
    end

    assert_redirected_to canvas_path(assigns(:canvas))
  end

  test "should show canvas" do
    get :show, :id => canvases(:one).id
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => canvases(:one).id
    assert_response :success
  end

  test "should update canvas" do
    put :update, :id => canvases(:one).id, :canvas => { }
    assert_redirected_to canvas_path(assigns(:canvas))
  end

  test "should destroy canvas" do
    assert_difference('Canvas.count', -1) do
      delete :destroy, :id => canvases(:one).id
    end

    assert_redirected_to canvases_path
  end
end

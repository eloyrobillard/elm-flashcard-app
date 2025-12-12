module Main exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Page.Backup as Backup
import Page.Browser as Browser
import Page.Deck as Deck
import Page.Home as Home
import Page.Login as Login
import Page.Review as Review
import Page.Statistics as Statistics
import Url


type Model
    = -- NotFound Session
      Home Home.Model
    | Review Review.Model
    | Login Login.Model
    | Statistics Statistics.Model
    | Backup Backup.Model
    | Deck Deck.Model
    | Browser Browser.Model



-- MAIN


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }



-- MODEL


type alias Model =
    { key : Nav.Key
    , url : Url.Url
    }


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url key =
    ( Model key url, Cmd.none )



-- UPDATE


type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        UrlChanged url ->
            ( { model | url = url }
            , Cmd.none
            )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Browser.Document Msg
view model =
    let
        viewPage page toMsg config =
            let
                { title, body } =
                    Page.view page config
            in
            { title = title
            , body = List.map (Html.map toMsg) body
            }
    in
    case model of
        Login login ->
            viewPage Page.Other GotLoginMsg (Login.view login)

        Home home ->
            viewPage Page.Home GotHomeMsg (Home.view home)


viewLink : String -> Html msg
viewLink path =
    li [] [ a [ href path ] [ text path ] ]

module Main exposing (..)

import Array
import Browser
import Browser.Navigation as Nav
import Deckname
import Html exposing (..)
import Html.Attributes exposing (..)
import Page
import Page.Backup as Backup
import Page.Browser as Browser
import Page.Deck as Deck
import Page.Home as Home
import Page.Login as Login
import Page.Review as Review
import Page.Statistics as Statistics
import Route
import Session
import Url


type Model
    = Review Review.Model


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = ChangedUrl
        , onUrlRequest = ClickedLink
        }



-- MODEL


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url key =
    changeRouteTo (Route.fromUrl url)
        (Review { session = Session.fromViewer key, showDeleteConfirmDialog = False, editingQuestion = False, editingAnswer = False, showDropdown = False, freeTextQuestion = "", freeTextAnswer = "", isEditing = False, showQuestion = False, showAnswer = False, questionNumber = 0, deck = Array.empty })



-- UPDATE


type Msg
    = ChangedUrl Url.Url
    | ClickedLink Browser.UrlRequest
    | GotReviewMsg Review.Msg


changeRouteTo : Maybe Route.Route -> Model -> ( Model, Cmd Msg )
changeRouteTo maybeRoute model =
    let
        session =
            toSession model
    in
    case maybeRoute of
        Nothing ->
            -- ( NotFound, Cmd.none )
            Review.init session (Deckname.Deckname "")
                |> updateWith Review GotReviewMsg model

        Just (Route.Review deckname) ->
            Review.init session deckname
                |> updateWith Review GotReviewMsg model


toSession : Model -> Session.Session
toSession model =
    case model of
        Review review ->
            Review.toSession review


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( ClickedLink urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    case url.fragment of
                        Nothing ->
                            -- If we got a link that didn't include a fragment,
                            -- it's from one of those (href "") attributes that
                            -- we have to include to make the RealWorld CSS work.
                            --
                            -- In an application doing path routing instead of
                            -- fragment-based routing, this entire
                            -- `case url.fragment of` expression this comment
                            -- is inside would be unnecessary.
                            ( model, Cmd.none )

                        Just _ ->
                            ( model
                            , Nav.pushUrl (Session.navKey (toSession model)) (Url.toString url)
                            )

                Browser.External href ->
                    ( model
                    , Nav.load href
                    )

        ( ChangedUrl url, _ ) ->
            changeRouteTo (Route.fromUrl url) model

        ( GotReviewMsg subMsg, Review review ) ->
            Review.update subMsg review
                |> updateWith Review GotReviewMsg model


updateWith : (subModel -> Model) -> (subMsg -> Msg) -> Model -> ( subModel, Cmd subMsg ) -> ( Model, Cmd Msg )
updateWith toModel toMsg model ( subModel, subCmd ) =
    ( toModel subModel
    , Cmd.map toMsg subCmd
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
        Review deck ->
            viewPage (Page.Review (Deckname.Deckname "")) GotReviewMsg (Review.view deck)


viewLink : String -> Html msg
viewLink path =
    li [] [ a [ href path ] [ text path ] ]

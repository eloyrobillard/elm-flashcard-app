module Page exposing (..)

import Browser
import Deckname exposing (Deckname)
import Html exposing (..)
import Html.Attributes exposing (..)
import Route


type Page
    = Other
    | Review Deckname.Deckname


type Msg
    = GotHomeMsg
    | GotLoginMsg


view : Page -> { title : String, content : Html msg } -> Browser.Document msg
view page { title, content } =
    { title = title ++ " - Conduit"
    , body = [ viewHeader page, content, viewFooter ]
    }


viewHeader : Page -> Html msg
viewHeader page =
    nav [ class "navbar navbar-light" ]
        [ div [ class "container" ]
            [ a [ class "navbar-brand", Route.href (Route.Review (Deckname.Deckname "")) ]
                []
            ]
        ]


viewFooter : Html msg
viewFooter =
    footer []
        [ div [ class "container" ]
            [ a [ class "logo-font", href "/" ] []
            , span [ class "attribution" ]
                [ a [ href "" ] []
                ]
            ]
        ]

(ns data-enrichtment-and-analysis.scraper
  (:require [net.cgrand.enlive-html :as html])
  (:require [clj-http.client :as client])
  (:require [clojure.java.io :as io]))


;; ---
;; The fetching and parsing part for vornamen.ch
;; ---

(def base-url "http://www.vornamen.ch/name/")

(defn fetch-url [name]
  (:body (client/get (str base-url (.toLowerCase name) ".html"))))

(defn parse-response [name]
  (html/html-resource (java.io.StringReader. (fetch-url name))))

(defn common-in-languages [name]
  ;;(Thread/sleep 5000)
  (map html/text
       (html/select
        (parse-response name) [:div#content :div.entry :table#p0 :a.sprachen])))

(comment
  (common-in-languages "André")
  (common-in-languages "Reto2") )

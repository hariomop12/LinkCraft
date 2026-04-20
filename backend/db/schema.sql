\restrict dbmate

-- Dumped from database version 16.13
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: reserved_words; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reserved_words (
    id integer NOT NULL,
    word character varying(50) NOT NULL,
    reason character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: reserved_words_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reserved_words_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reserved_words_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reserved_words_id_seq OWNED BY public.reserved_words.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: urls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.urls (
    id integer NOT NULL,
    shorturl character varying(10) NOT NULL,
    longurl character varying(2000) NOT NULL,
    userid integer,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    click_count integer DEFAULT 0,
    last_accessed timestamp without time zone,
    title character varying(255),
    description text,
    is_custom_code boolean DEFAULT false,
    tags text,
    status character varying(20) DEFAULT 'active'::character varying,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: urls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.urls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: urls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.urls_id_seq OWNED BY public.urls.id;


--
-- Name: user_url_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_url_history (
    id integer NOT NULL,
    userid integer NOT NULL,
    urlid integer NOT NULL,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: user_url_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_url_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_url_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_url_history_id_seq OWNED BY public.user_url_history.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: reserved_words id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reserved_words ALTER COLUMN id SET DEFAULT nextval('public.reserved_words_id_seq'::regclass);


--
-- Name: urls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls ALTER COLUMN id SET DEFAULT nextval('public.urls_id_seq'::regclass);


--
-- Name: user_url_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_url_history ALTER COLUMN id SET DEFAULT nextval('public.user_url_history_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: reserved_words reserved_words_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reserved_words
    ADD CONSTRAINT reserved_words_pkey PRIMARY KEY (id);


--
-- Name: reserved_words reserved_words_word_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reserved_words
    ADD CONSTRAINT reserved_words_word_key UNIQUE (word);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: urls urls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls
    ADD CONSTRAINT urls_pkey PRIMARY KEY (id);


--
-- Name: urls urls_shorturl_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls
    ADD CONSTRAINT urls_shorturl_key UNIQUE (shorturl);


--
-- Name: user_url_history user_url_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_url_history
    ADD CONSTRAINT user_url_history_pkey PRIMARY KEY (id);


--
-- Name: user_url_history user_url_history_userid_urlid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_url_history
    ADD CONSTRAINT user_url_history_userid_urlid_key UNIQUE (userid, urlid);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_urls_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_urls_status ON public.urls USING btree (status);


--
-- Name: idx_urls_userid; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_urls_userid ON public.urls USING btree (userid);


--
-- Name: urls urls_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls
    ADD CONSTRAINT urls_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- Name: user_url_history user_url_history_urlid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_url_history
    ADD CONSTRAINT user_url_history_urlid_fkey FOREIGN KEY (urlid) REFERENCES public.urls(id);


--
-- Name: user_url_history user_url_history_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_url_history
    ADD CONSTRAINT user_url_history_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict dbmate


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20250313210241'),
    ('20250313213002'),
    ('20250314062703'),
    ('20250314070241'),
    ('20250314071953'),
    ('20260420043855'),
    ('20260420053325');

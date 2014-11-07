<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

# Yet Another RESTful API Standard (YARAS) - Introduction
  YARAS provides standards, guidelines and conventions for writing a RESTful API and is intended to encourage consistency, maintainability, and consistent use of best practices.

## Table of Contents

- [Introduction](#introduction)
- [Build](#build)
- [Create a PDF version](#create-a-pdf-version)
- [Create an HTML version](#create-an-html-version)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Introduction

YARAS is a RESTful standard - full details are in restful-standards.md.

# Build

I use doctoc (and grunt-doctoc) to keep the table of contents up to date.

To run that:

	npm install
	grunt

# Create a PDF version

For those that want to have this as a PDF:

	npm install
	grunt pdf

This will create restful-standards.pdf

# Create an HTML version

iFor those that want to have this as a HTML:

        npm install
        grunt html

This will create an html version in /html. 

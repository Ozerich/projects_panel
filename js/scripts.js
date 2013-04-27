function nl2br(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

$(function () {

    function Popup(_element) {
        var that = this;
        if ($('#popup_overlay').length === 0) {
            this.overlay = $('<div id="popup_overlay" style="position:absolute;background: #000; opacity: 0.8;left:0;right:0;top:0;bottom:0;z-index:10001"></div>').appendTo($('body'));
        }
        else {
            this.overlay = $('#popup_overlay');
        }

        if ($('#popup_window').length === 0) {
            this.window = $('<div id="popup_window" style="position: absolute; background: #ececec; border-radius: 5px; padding: 5px; z-index: 10002"></div>').appendTo($('body'));
        } else {
            this.window = $('#popup_window');
        }

        this.overlay.hide();
        this.window.hide();

        _element = $(_element).clone().show();
        this.element = _element;

        this.window.append(_element);


        this.show = function () {
            this.window.empty().append(this.element);
            that.overlay.fadeIn(function () {
                that.window.show();
                that.center();
            });
        };

        this.hide = function () {
            that.window.hide();
            that.overlay.fadeOut();
        };

        this.overlay.click(function () {
            that.hide();
        });

        this.center = function () {
            that.window.css("top", Math.max(0, (($(window).height() - $(this.window).outerHeight()) / 2) +
                $(window).scrollTop()) + "px");
            that.window.css("left", Math.max(0, (($(window).width() - $(this.window).outerWidth()) / 2) +
                $(window).scrollLeft()) + "px");
            return this;
        }
    }

    // хедер
    (function () {

        var $profile_block = $('.profile-block');
        var $submenu = $profile_block.find('.dropdown-menu');

        $profile_block.find('.dropdown-toggle').on('click', function () {
            $submenu.fadeToggle();
            return false;
        });

        $(document).on('click', function (event) {
            if ($(event.target).parents('.profile-block').length === 0) {
                $submenu.fadeOut();
            }
        });

    })();

    // страница с формой проекта
    (function () {

        var $form = $('#form_project');
        if ($form.length === 0) return;

        var $customer_block = $('#widget_customer');
        var $worker_block = $('#widget_worker');
        var $status_select = $form.find('.status-select');

        $form.find('#closed').click(function () {

            if ($(this).is(':checked')) {
                $status_select.attr('disabled', 'disabled');
            }
            else {
                $status_select.removeAttr('disabled');
            }

        });


        $form.find('#insert_from_worker').on('click', function () {

            $customer_block.find('.text').val($worker_block.find('.text').val());

            return false;
        });

        $form.find('#insert_from_customer').on('click', function () {

            $worker_block.find('.text').val($customer_block.find('.text').val());

            return false;
        });


        $form.find('.btn-select-left').on('click', function () {

            var $block = $(this).parents('.lists');
            var $source_select = $block.find('.source-select');
            var $destination_select = $block.find('.destination-select');

            $destination_select.find('option:selected').each(function () {
                $source_select.append($(this).clone());
                $(this).remove();
            });

            return false;
        });

        $form.find('.btn-select-right').on('click', function () {

            var $block = $(this).parents('.lists');
            var $source_select = $block.find('.source-select');
            var $destination_select = $block.find('.destination-select');

            $source_select.find('option:selected').each(function () {
                $destination_select.append($(this).clone());
                $(this).remove();
            });

            return false;
        });


        $form.find('input[type=submit]').on('click', function () {

            var $hid_workers = $('#hid_workers_list'), $hid_customers = $('#hid_customers_list');

            $form.find('.destination-select').each(function () {
                var values = [];

                $(this).find('option').each(function () {
                    values.push($(this).val());
                });

                $('#hid_' + $(this).attr('for')).val(values.length > 0 ? values.join(',') : '');
            });

            return true;
        });

    })();


    // страница с страницей проект
    (function () {
        if ($('#page_project').length === 0)return;

        var $description_block = $('.additional-info');
        var $btn_hide_description = $('#btn_hide_description');
        var $btn_show_description = $('#btn_show_description');
        var $btn_edit_project = $('#btn_edit_project');

        $btn_show_description.click(function () {
            $btn_hide_description.hide();
            $btn_edit_project.show();
            $btn_show_description.hide();

            $description_block.slideDown(function () {
                $btn_hide_description.show();
            });
            return false;
        });

        $btn_hide_description.click(function () {
            $btn_show_description.show();
            $btn_edit_project.hide();
            $btn_hide_description.hide();
            $description_block.slideUp();
            return false;
        });


        var $comments_form = $('.comments-form');

        function addFileInput() {
            var $item = $comments_form.find('.file-item.example').clone();

            $item.removeClass('example').show();

            $comments_form.find('.files').append($item);
        }

        addFileInput();

        $comments_form.on('change', 'input:file', function () {
            var $block = $(this).parents('.file-item');
            var filename = $(this).val().substring($(this).val().lastIndexOf('\\') + 1, $(this).val().length);

            $block.find('.filename-block .filename').text(filename);

            $block.find('.file').hide();
            $block.find('.filename-block').css('display', 'inline-block');

            addFileInput();
        });

        $comments_form.on('click', '.delete-file', function () {
            var $block = $(this).parents('.file-item');
            $block.remove();

            return false;
        });


        $(".fancybox").fancybox();


        $('#btn_add_comment').on('click', function () {

            var $message_textarea = $('.comments-form').find('textarea');
            if ($message_textarea.val().length === 0) {
                alert('Сообщение не может быть пустым');
                return;
            }

            var $btn = $(this).prop('disabled', true);

            function successCallback() {
                $btn.prop('disabled', false);
                $message_textarea.val('');

                $comments_form.find('.file-item').not('.example').remove();
                addFileInput();

                updateComments();
            }

            $comments_form.find('.file-item:last').remove();

            $comments_form.find('.file-item:visible').find('.status').text('в очереди');
            $comments_form.find('.file-item:visible').find('.delete-file').hide();

            $.post('/projects/add_comment', {message: $message_textarea.val(), project_id: $('#project_id').val(), mode: $('#active_mode').val()}, function (data) {

                data = jQuery.parseJSON(data);

                var comment_id = data.comment_id;
                var count = $comments_form.find('.file-item:visible').length;

                if (count === 0) {
                    successCallback();
                }
                else {
                    $comments_form.find('.file-item:visible').each(function (ind) {
                        var $file_item = $(this);

                        $file_item.find('.status').text('загрузка...');
                        $file_item.find('input:file').attr('id', 'comment_file_' + ind);

                        (function ($file_item, is_last) {
                            $.ajaxFileUpload({
                                url: '/projects/upload_comment_file/comment/' + comment_id,
                                secureuri: false,
                                fileElementId: 'comment_file_' + ind,
                                dataType: 'json',
                                success: function (data, status) {
                                    if (data != 0) {
                                        $file_item.find('.status').addClass('status-success').text('Загружен');
                                    }
                                    else {
                                        $file_item.find('.status').addClass('status-error').text('Ошибка');
                                    }

                                    if (is_last) {
                                        successCallback();
                                    }
                                }
                            });
                        })($file_item, ind === count - 1);
                    });
                }


            });

            return false;
        });


        var $comments_block = $('.comments-block');

        $comments_block.on('click', '.btn-delete', function () {

            if (!confirm('Вы уверены?')) {
                return false;
            }

            var $file_row = $(this).parents('li');

            $.get('/projects/delete_comment_file/' + $file_row.data('id'));

            $file_row.fadeOut(function () {
                $(this).remove();
            });

            return false;
        });

        $comments_block.on('click', '.btn-delete-comment', function () {
            if (!confirm('Вы уверены, что хотите удалить комментарий?'))return false;

            var $block = $(this).parents('.comment-item');

            showCommentsLoader();
            $.get('/projects/delete_comment/' + $block.data('id'), function () {
                updateComments();
            });


            $block.remove();

            return false;
        });

        $comments_block.on('click', '.btn-edit-comment', function () {
            var $block = $(this).parents('.comment-item');


            $block.find('.edit-block textarea').val($block.find('.comment-text').text());

            $block.find('.comment-text, .pull-right').hide();
            $block.find('.edit-block').show();

            return false;
        });

        $comments_block.on('click', '.edit-block .btn-save', function () {
            var $block = $(this).parents('.comment-item');

            var message = $block.find('.edit-block textarea').val();

            $block.find('.comment-text').html(nl2br(message));
            $block.find('.comment-text, .pull-right').show();
            $block.find('.edit-block').hide();

            $.post('/projects/edit_comment/' + $block.data('id'), {
                message: message
            });

            return false;
        });


        $comments_block.on('click', '.edit-block .btn-cancel', function () {
            var $block = $(this).parents('.comment-item');

            $block.find('.comment-text, .pull-right').show();
            $block.find('.edit-block').hide();

            return false;
        });


        function setMode(mode) {
            $('.project-footer').removeClass('customer').removeClass('worker').addClass(mode);
            if (mode == 'customer') {
                $('[mode=worker]').hide();
                $('[mode=customer]').show();
            } else {
                $('[mode=customer]').hide();
                $('[mode=worker]').show();
            }

            $('#active_mode').val(mode);
        }


        $('.project-footer').find('.switch').on('click', function () {

            $('.project-footer').find('.switch').removeClass('active');
            $(this).addClass('active');

            setMode($(this).hasClass('customer') ? 'customer' : 'worker');

            return false;
        });


        var popup = new Popup($('#popup_form'));

        var openPopup = function (direction) {
            var $popup_form = popup.window;

            $popup_form.find('textarea').val('');
            $popup_form.find('.files').empty();

            var files = [];

            $('.comment-item:visible .files li').each(function () {
                if ($(this).find('input[type=checkbox]').is(':checked')) {
                    files.push($(this));
                }
            });

            for (var i = 0; i < files.length; i++) {
                var file = $('<li data-id="' + files[i].data('id') + '"><span class="filename">' + files[i].find('.filename').text() + '</span><span class="size">' + files[i].find('.size').text() + '</span></li>')
                $popup_form.find('.files').append(file);
            }


            $popup_form.find('label').toggle(files.length > 0);
            $popup_form.find('.direction').val(direction);
            popup.show();
        };

        $('#btn_to_customer').click(function () {
            openPopup('customer');
            return false;
        });

        $('#btn_to_worker').click(function () {
            openPopup('worker');
            return false;
        });

        var slider_pages = [];


        function toggleSliderLoader(state) {
            $('#slider .loader').toggle(state);
            if (state) {
                $('#btn_to_slider').attr('disabled', 'disabled');
            }
            else {
                $('#btn_to_slider').removeAttr('disabled');
            }
        }

        function updateSliderPage(page_id) {
            page_id = page_id || $('.slider-page:visible').data('id');
            $.post('/slider/' + $('#project_id').val(), {page_id: page_id}, function (html) {
                $('.slider-page[data-id=' + page_id + ']').html(html);
                toggleSliderLoader(false);
            });
        }

        function updateSlider() {
            if ($('#slider').length === 0)return;
            toggleSliderLoader(true);

            $.post('/slider/' + $('#project_id').val(), {},
                function (data) {
                    data = jQuery.parseJSON(data);
                    slider_pages = data.pages;

                    if (slider_pages.length === 0) {
                        $('#slider .slider-container').empty();
                        $('#slider').hide();
                    }
                    else {
                        $('#slider .slider-container').html(data.html);
                        $('#slider').show();
                    }

                    toggleSliderLoader(false);
                }
            );
        }

        $(function () {
            updateSlider();
        });

        var slider_popup = new Popup($('#popup_slider'));

        $('#btn_to_slider').on('click', function () {
            var files = [];

            $('.comment-content:visible .files li').each(function () {
                if ($(this).find('input[type=checkbox]').prop('checked')) {
                    files.push($(this).data('id'));
                }

                $(this).find('input[type=checkbox]:checked').prop('checked', false);
            });

            if (files.length == 0) {
                alert('Выберите файлы');
                return false;
            }

            var pages_count = $('#pages_count').val();

            slider_popup.element.find('select').empty().append('<option value="0">Новая страница</option>');
            for (var i = 0; i < slider_pages.length; i++) {
                slider_popup.element.find('select').append('<option value="' + slider_pages[i] + '">Страница ' + (i + 1) + '</option>');
            }


            slider_popup.show();

            slider_popup.element.find('button').click(function () {
                var $btn = $(this);
                $btn.prop('disabled', true);
                $.post('/slider/add', {
                    project_id: $('#project_id').val(),
                    files: files,
                    page: slider_popup.element.find('select option:selected').val()
                }, function () {
                    $btn.prop('disabled', false);
                    slider_popup.hide();
                    updateSlider();
                });

                return false;
            });

            return false;
        });


        $(document).on('click', '.submit-popup', function () {
            var $form = $(this).parents('.popup-form');

            var request = {
                message: $form.find('textarea').val(),
                to_slider: $form.find('input[type=checkbox]').is(':checked') ? 1 : 0,
                files: [],
                to: $form.find('.direction').val()
            };

            $form.find('.files').find('li').each(function () {
                request.files.push($(this).data('id'));
            });

            var $btn = $(this);
            $btn.attr('disabled', 'disabled');
            $.post('/projects/admin_comment/' + $('#project_id').val(), request, function (data) {
                $btn.removeAttr('disabled');
                popup.hide();
                updateComments();
            });

            return false;
        });


        $('#btn_delete_files').click(function () {
            if (!confirm("Вы уверены что хотите удалить выбранные файлы?"))return;

            var files = [];

            $('.comment-item:visible .files li').each(function () {
                if ($(this).find('input[type=checkbox]').is(':checked')) {
                    files.push($(this).data('id'));
                    $(this).remove();
                }
            });

            $.post('/projects/delete_files', {files: files});

            return false;
        });


        if ($('#slider').length > 0) {
            var slider = $('#slider');
            slider.on('click', '.slider-item .btn-delete', function () {
                if (!confirm("Вы уверены что хотите удалить файл из слайдера?"))return;

                var page_id = $(this).parents('.slider-page').data('id');
                var $item = $(this).parents('.slider-item');
                var id = $item.data('id');
                $item.remove();
                toggleSliderLoader(true);

                $.get('/slider/delete_item/' + id, function () {
                    if ($(this).parents('.slider-page').find('.slider-item').length === 0) {
                        updateSlider();
                    } else {
                        updateSliderPage(page_id);
                    }
                });

                return false;
            });

            slider.on('click', '.slider-pagination a', function () {
                var page_num = $(this).data('num');
                slider.find('.slider-page').hide();
                $(slider.find('.slider-page').get(page_num - 1)).show();
                return false;
            });

            slider.on('click', '.page-actions .btn-delete', function () {
                if (!confirm("Вы уверены что хотите удалить страницу из слайдера?"))return;
                toggleSliderLoader(true);

                $.get('/slider/delete_page/' + $(this).parents('.slider-page').data('id'), function () {
                    updateSlider();
                });

                return false;
            });

            var slider_html_popup = new Popup($('#popup_html_slider'));

            slider.on('click', '.page-actions .btn-add_html', function () {
                slider_html_popup.show();

                var page_id = $(this).parents('.slider-page').data('id');
                slider_html_popup.element.find('.page-id').val($(this).parents('.slider-page').data('id'));
                slider_html_popup.element.find('button').click(function () {

                    var $btn = $(this);
                    $btn.attr('disabled', 'disabled');

                    $.post('/slider/add', {
                        project_id: $('#project_id').val(),
                        page: page_id,
                        html: slider_html_popup.element.find('textarea').val(),
                    }, function () {
                        $btn.prop('disabled', false);
                        slider_popup.hide();
                        updateSliderPage();
                    });

                    return false;
                });

                return false;
            });
        }


    })();

    function showCommentsLoader() {
        $('.comments-block').find('.loader').fadeIn();
    }

    function updateComments() {
        var $comments_block = $('.comments-block');
        showCommentsLoader();

        $.get('/projects/comments/' + $('#project_id').val(), function (data) {
            $comments_block.find('.comments-list').html(data);
            $comments_block.find('[mode]').hide();
            $comments_block.find('[mode=' + $('#active_mode').val() + ']').show();
            $('.comments-block').find('.loader').fadeOut();

            $(".fancybox").fancybox();

        });
    }


    function loadUnreadComments(callback) {
        $.post('/ajax/get_unread_comments', {}, function (data) {
            data = jQuery.parseJSON(data);

            var $message_status_block = $('.message-status-block');

            $message_status_block.toggleClass('new-exist', data.count > 0);
            if (data.count > 0) {
                $message_status_block.find('span').html(data.count);

                if ($('#page_project').length > 0) {
                    var project_id = $('#project_id').val();
                    if (data.projects_count[project_id]) {
                        updateComments();
                    }
                }
            }


            callback();
        });
    }

    function commentsTimerFunction() {
        loadUnreadComments(function () {
            setTimeout(commentsTimerFunction, 5000);
        });
    }

    commentsTimerFunction();

});
